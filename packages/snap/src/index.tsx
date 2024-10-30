import {
  UserInputEventType,
  type OnRpcRequestHandler,
  type OnUserInputHandler,
  type OnHomePageHandler,
} from "@metamask/snaps-sdk";
import { Container, Box, Section, Heading, Text, Bold, Footer, Button, Icon, Image, Link } from '@metamask/snaps-sdk/jsx';
import arrow from "./../img/arrow.svg"

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: (
      <Box>
        <Section>
          <Heading>Hello world!</Heading>
          <Text>Below is a showcase of features in MetaMask Extension 12.5:</Text>
        </Section>
        <Section>
          <Heading>New Icon component!</Heading>
          <Icon name="wifi"></Icon>
          <Icon name="card" color="muted"></Icon>
          <Icon name="home"></Icon>
        </Section>
        <Section>
          <Text>Buttons can now wrap images and icons!</Text>
          <Box>
            <Button><Image src={arrow} /></Button>
          </Box>
          <Box>
            <Button><Icon name="add"></Icon></Button>
          </Box>
        </Section>
        <Section>
          <Text>Learn more in our <Link href="https://docs.metamask.io/snaps/">documentation</Link>.</Text>
        </Section>
      </Box>
    ),
  };
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          content: (
            <Container>
              <Box>
                <Section>
                  <Heading>
                    Hello, {origin}!
                  </Heading>
                  <Text>
                    This custom confirmation is just for display purposes. It uses the new Section component to create a light background section within the page. Do you like it?
                  </Text>
                </Section>
              </Box>
              <Footer>
                <Button name="no">No</Button>
                <Button name="yes">Yes</Button>
              </Footer>
            </Container>
          ),
        },
      });

      console.log(result); 

      return snap.request({
        method: 'snap_dialog',
        params: { 
          content: (
            <Container>
              <Box>
                <Section>
                  <Heading>Response received</Heading>
                  <Text>You said {''+result}!</Text>
                </Section>
              </Box>
            </Container>
          )
        },
      }); 
    default:
      throw new Error('Method not found.');
  }
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case "no": // User selected "No" in the footer.
        await snap.request({
          method: "snap_resolveInterface",
          params: {
            id,
            value: "No",
          },
        });
        break;

      case "yes": {
        // User selected "Yes" in the footer
        await snap.request({
          method: "snap_resolveInterface",
          params: {
            id,
            value: "Yes",
          },
        });
        break;
      }

      default:
        break;
    }
  }
};