import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createMuiTheme, CssBaseline, useMediaQuery } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import { useMemo } from "react";
import SantaList from "./SantaList";

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WS_URI || "",
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || "",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: blue[200],
          },
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SantaList />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
