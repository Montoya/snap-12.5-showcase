import {
  UserInputEventType,
  type OnRpcRequestHandler,
  type OnUserInputHandler,
  type OnHomePageHandler,
} from "@metamask/snaps-sdk";
import { Container, Box, Section, Heading, Text, Card, Footer, Button} from '@metamask/snaps-sdk/jsx';

import icon from "./../img/icon.svg"

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: (
      <Box>
        <Card 
          image={icon} 
          title="Card title" 
          description="Card description" 
          value="Card value" 
          extra="Extra value"
        />
        <Card 
          title="Minimal card" 
          value="Example value" 
        />
        <Section>
          <Card 
            image={icon} 
            title="Card title" 
            description="Card description" 
            value="Card value" 
            extra="Extra value"
          />
          <Card 
            title="Minimal card" 
            value="Example value" 
          />
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