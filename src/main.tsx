import { render } from "preact";
import App from "./App";
import {checking_Sound_track_data} from './api/Backend_Api_call';



checking_Sound_track_data();







render(<App />, document.getElementById("root")!);
