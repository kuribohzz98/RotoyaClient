import { combineEpics } from "redux-observable";
import { imageSportCenterEpic } from "./image";

export default combineEpics(
    imageSportCenterEpic
);