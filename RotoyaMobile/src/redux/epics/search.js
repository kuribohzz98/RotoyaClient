import { ofType } from "redux-observable";
import { mergeMap, map, debounceTime } from "rxjs/operators";
import { of } from "rxjs";
import { ActionConstants } from "../../constants";

export const searchSportCenterEpic = (actions$, state$) => {
    return actions$.pipe(
        ofType(ActionConstants.SEARCH_SPORT_CENTER_EPIC),
        debounceTime(1000),
        mergeMap(action => {
            return of({
                type: ActionConstants.SEARCH_SPORT_CENTER,
                name: action.name
            })
        })
    )
}