import {useSelector} from "react-redux";
import {RootState} from "@coinvant/store";

export const useAppSelector = useSelector.withTypes<RootState>();
