import React, { useEffect, useState } from "react";
import {
  ClientContext,
  EdgeFeatureHubConfig,
  Readyness,
  FeatureHubPollingClient,
  StrategyAttributeCountryName,
  GoogleAnalyticsCollector,
} from "featurehub-javascript-client-sdk";

function App() {
  const [state, setState] = useState<any>({
    color: "yellow",
  });

  let initialized = false;
  let fhConfig: EdgeFeatureHubConfig;
  let fhClient: ClientContext;

  async function initializeFeatureHub() {
    const fh_edge_url =
      "https://ccui-featurehubpoc.service.eu-west-1.dev.deveng.systems/";
    const fh_api_key =
      "default/2b2d2794-fc58-46fa-9cb5-0ff0cebdb471/yozcLVmd1tMubvttzo0jy679465myY*QoGcu787LM7vdkw2uCxC";

    fhConfig = new EdgeFeatureHubConfig(fh_edge_url, fh_api_key); // initialise config

    fhClient = await fhConfig.newContext().build(); // create FeatureHub client

    fhConfig.addReadynessListener((readyness) => {
      if (!initialized) {
        if (readyness === Readyness.Ready) {
          initialized = true;
          const color = fhClient.getString("SUBMIT_COLOR_BUTTON");
          setState({ ...state, color: color });
        }
      }
    });

    // react to incoming feature changes in real-time
    fhClient.feature("SUBMIT_COLOR_BUTTON").addListener((fs) => {
      setState({ ...state, color: fs.getString() });
    });
  }
  useEffect(() => {
    initializeFeatureHub();

    return () => fhConfig.close();
  });

  return (
    <div className="App">
      <h1>Hello Feature Flag</h1>
      <button style={{ background: `${state.color}` }}>switch on</button>
    </div>
  );
}

export default App;
