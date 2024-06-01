import { AddProduct } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setFilterToggle } from "@/Redux/Reducers/ProductSlice";
import Link from "next/link";
import { Filter } from "react-feather";

export const DealerListFilterHeader = () => {
    const { i18LangStatus } = useAppSelector((state: any) => state.langSlice);
    const { filterToggle } = useAppSelector((state: any) => state.product);
    const dispatch = useAppDispatch();

    return (
        <div>
            <div className="light-box" onClick={() => dispatch(setFilterToggle())}>
                <a>
                    <Filter className={`filter-icon ${filterToggle ? "hide" : "show"}`} />
                    <i className={`icon-close filter-close ${filterToggle ? "show" : "hide"}`} />
                </a>
            </div>
            <Link className="btn btn-primary" href={`/${i18LangStatus}/ecommerce/add_product`}>
                <i className="fa fa-plus" />
                Add Dealer
            </Link>
        </div>
    );
};
