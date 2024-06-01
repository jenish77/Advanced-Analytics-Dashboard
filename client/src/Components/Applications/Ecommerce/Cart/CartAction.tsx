import { Button, Input, InputGroup } from 'reactstrap';
import { Apply, CheckOut, ContinueShopping, TotalPrice } from "@/Constant";
import { useAppSelector } from '@/Redux/Hooks';
import Link from 'next/link';
import { getallCardTotal } from '@/utils/Ecommerce.service';

const CartAction = () => {
  const { cart } = useAppSelector((state) => state.cartData);
  const { symbol } = useAppSelector((state) => state.product);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <>
      <tr>
        <td colSpan={4}>
          <InputGroup>
            <Input className="me-2" type="text" placeholder="Enter coupan code"/>
            <Button as="a" color="primary" className="text-white">{Apply}</Button>
          </InputGroup>
        </td>
        <td className="total-amount">
          <h4 className= "m-0 text-end" ><span className="f-w-700">{TotalPrice} :</span></h4>
        </td>
        <td><span>{symbol}{getallCardTotal(cart)}</span></td>
      </tr>
      <tr>
        <td className="text-end" colSpan={5}><Link href={`/${i18LangStatus}/ecommerce/product`} className="btn btn-secondary cart-btn-transform">{ContinueShopping}</Link></td>
        <td><Link className="btn btn-success cart-btn-transform" href={`/${i18LangStatus}/ecommerce/checkout`}>{CheckOut}</Link></td>
      </tr>
    </>
  );
};

export default CartAction;
