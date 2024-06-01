import { AddProduct } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setFilterToggle } from "@/Redux/Reducers/ProductSlice";
import Link from "next/link";
import { Filter } from "react-feather";

export const FilterHeader = () => {
    
    const { filterToggle } = useAppSelector((state: any) => state.product);
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="light-box-autoWidth mb-0" onClick={() => dispatch(setFilterToggle())}>
                <a className="d-flex align-items-center gap-2">
                    <Filter className={`filter-icon ${filterToggle ? "hide" : "show"}`} />
                    <i className={`icon-close filter-close ${filterToggle ? "show" : "hide"}`} />
                    Filters
                </a>
            </div>
        </>
    );
};
