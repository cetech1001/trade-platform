import {useDispatch} from "react-redux";
import {AppDispatch} from "@coinvant/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
