import {
    Banner,
    Card,
    DisplayText,
    Form,
    FormLayout,
    Frame,
    Layout,
    Page,
    PageActions,
    TextField,
    Toast,
} from '@shopify/polaris';
import store from 'store-js';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const UPDATE_PRICE = gql`
   mutation productVariantUpdate($input: ProductVariantInput!) {
     productVariantUpdate(input: $input) {
       product {
         title
       }
       productVariant {
         id
         price
       }
     }
   }
  `;

class EditProduct extends React.Component {
    static contextType = Context;

    state = {
        discount: '',
        price: '',
        variantId: '',
        showToast: false,
    };

    componentDidMount() {
        this.setState({ discount: this.itemToBeConsumed() });
    }

    render() {
        const { name, price, discount, variantId } = this.state;
        const app = this.context;
        const redirectToHome = () => {
            const redirect = Redirect.create(app);
            redirect.dispatch(
                Redirect.Action.APP,
                '/',
            );
        };
        return (
            <Mutation
                mutation={UPDATE_PRICE}
            >
                {(handleSubmit, { error, data }) => {
                    const showError = error && (
                        <Banner status="critical">{error.message}</Banner>
                    );
                    const showToast = data && data.productVariantUpdate && (
                        <Toast
                            content="Sucessfully updated"
                            onDismiss={() => this.setState({ showToast: false })}
                        />
                    );
                    return (
                        <Frame>
                            <Page>
                                <Layout>
                                    {showToast}
                                    <Layout.Section>
                                        {showError}
                                    </Layout.Section>
                                    <Layout.Section>
                                        <DisplayText size="large">{name}</DisplayText>
                                        <Form>
                                            <Card sectioned>
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <TextField
                                                            prefix="$"
                                                            value={price}
                                                            disabled
                                                            label="Original price"
                                                            type="price"
                                                        />
                                                        <TextField
                                                            prefix="$"
                                                            value={discount}
                                                            onChange={this.handleChange('discount')}
                                                            label="Discounted price"
                                                            type="discount"
                                                        />
                                                    </FormLayout.Group>
                                                    <p>Note: This discount will expire in two weeks</p>
                                                </FormLayout>
                                            </Card>
                                            <PageActions
                                                primaryAction={[
                                                    {
                                                        content: 'Save',
                                                        onAction: () => {
                                                            const productVariableInput = {
                                                                id: variantId,
                                                                price: discount,
                                                            };
                                                            handleSubmit({
                                                                variables: { input: productVariableInput },
                                                            });
                                                            redirectToHome();
                                                        },
                                                    },
                                                ]}
                                                secondaryActions={[
                                                    {
                                                        content: 'Remove discount',
                                                        onAction: redirectToHome,
                                                    },
                                                ]}
                                            />
                                        </Form>
                                    </Layout.Section>
                                </Layout>
                            </Page>
                        </Frame>
                    );
                }}
            </Mutation>
        );
    }

    handleChange = (field) => {
        return (value) => this.setState({ [field]: value });
    };

    itemToBeConsumed = () => {
        const item = store.get('item');
        const price = item.variants.edges[0].node.price;
        const variantId = item.variants.edges[0].node.id;
        const discounter = price * 0.1;
        this.setState({ price, variantId });
        return (price - discounter).toFixed(2);
    };
}

export default EditProduct;
