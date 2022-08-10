import {appSliceActions} from "../store/reducers/app/app.slice";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {settingsSliceActions} from "../store/reducers/settings/settings.slice";

const actions = {
    ...appSliceActions,
    ...settingsSliceActions,
}

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}