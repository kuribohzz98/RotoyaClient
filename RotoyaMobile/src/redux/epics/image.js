import { ofType } from "redux-observable";
import { mergeMap, map } from "rxjs/operators";
import { from } from "rxjs";
import * as ImageService from "../../service/image.service";

export const imageSportCenterEpic = (actions$, state$) => {
    return actions$.pipe(
    //     ofType(ActionConstants.LAZYLOAD_IMAGE_SPORTCENTER),
    //     mergeMap(action => from(ImageService.getMultipleImageSportCenter(action.paths))),
    //     map(res => addImage(res.data))
    )
}