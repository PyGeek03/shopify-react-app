import React from 'react'
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import store from 'store-js';

class AnnotatedLayout extends React.Component {
  state = {
    discount: store.get('discount'),
    enabled: true,
  };

  render() {
    const { discount, enabled } = this.state;
    const contentStatus = enabled ? 'Enable' : 'Disable';

    return (
      <Page>
        <Layout>
          <Layout.AnnotatedSection
            title="Default discount"
            description="Add a product to Sample App, it will automatically be discounted."
          >
            <Card sectioned>
              <Form onSubmit={this.handleSubmit}>
                <FormLayout>
                  <TextField
                    value={discount}
                    onChange={this.handleChange('discount')}
                    label="Discount percentage"
                    type="number"
                    max="100"
                    min="0"
                  />
                  <div>
                    The new discount will be <TextStyle variation="strong"> {discount}%</TextStyle>.
                  </div>
                  <Stack distribution="trailing">
                    <Button primary submit>
                      Save
                    </Button>
                  </Stack>                  
                </FormLayout>
              </Form>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Price updates"
            description="Temporarily disable all Sample App price updates"
          >
            <SettingToggle
              action={{
                content: contentStatus,
                onAction: this.handleToggle,
              }}
              enabled={enabled}
            >
              <div>
                Price update is
                  <TextStyle variation="strong">
                    {enabled
                      ? <TextStyle variation="negative"> disabled</TextStyle>
                      : <TextStyle variation="positive"> enabled</TextStyle>
                    }
                  </TextStyle>.
              </div>
            </SettingToggle>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    );
  }

  handleSubmit = () => {
    this.setState({
      discount: Number(this.state.discount),
    });
    store.set('discount', this.state.discount);
    console.log('submission', this.state);
  };

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  handleToggle = () => {
    this.setState(({ enabled }) => {
      return { enabled: !enabled };
    });
    store.set('update-disabled', !this.state.enabled);
  };
}

export default AnnotatedLayout;
