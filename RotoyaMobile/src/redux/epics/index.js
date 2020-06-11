import { combineEpics } from "redux-observable";
import { searchSportCenterEpic } from "./search";

export default combineEpics(
    searchSportCenterEpic
);