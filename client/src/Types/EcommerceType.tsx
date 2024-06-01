import { InputType } from "reactstrap/types/lib/Input";

export interface OrderHistoryTableColumns {
  image: string;
  productName: string;
  tag: string;
  size: string;
  color: string;
  articleNumber: number;
  units: number;
  price: string;
  icon: JSX.Element;
}

export interface OrderHistoryImageType {
  name: string;
  tag?: string;
}

export interface FormGroupCommonProp {
  type: InputType;
  placeholder?: string;
  formClass?: string;
  rows?: number;
}

export interface SelectCommonProp {
  data: string[];
  size: number;
  selectClass?: string;
}

export interface ProductListTableDataColumnType {
  image: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  rating: number;
}

export interface ProductListTableProduct {
  images?: string;
  name?: string;
  rate?: number;
}

interface VariantsInterface {
  color: string;
  images: string;
}

export interface ProductItemInterface {
  id: number;
  image: string;
  name: string;
  note: string;
  description: string;
  discountPrice: string;
  status: string;
  price: number;
  stock: string;
  review: string;
  category: string;
  colors: string[];
  size: string[];
  tags: string[];
  variants: VariantsInterface[];
  ribbonClassName?: string;
  rating: number;
}

export interface ProductSliceProp {
  filterToggle: boolean;
  productItem: ProductItemInterface[];
  symbol: string;
}

export interface ClothsDetailsTabContentProp {
  activeTab: number;
}

interface VariantsType {
  color: string;
  images: string;
}
export interface CartType {
  variants: VariantsType[];
  total?: any;
  sum?: number;
  id: number;
  image: string;
  name: string;
  note: string;
  description: string;
  discountPrice: string;
  price: number;
  status: string;
  ribbonClassName?: string;
  stock: string;
  review: string;
  rating: number;
  category: string;
  colors: string[];
  size: string[];
  tags: string[];
}

interface ValueInterface {
  min: number;
  max: number;
}
export interface FilterInterface {
  color: string;
  searchBy: string;
  value: ValueInterface;
  sortBy: string;
  category: string[];
  brand: string[];
}

interface CommonProductSlideData {
  rowClass?: string;
  image: string;
  title: string;
  text: string;
}

export interface CommonProductSlideProp {
  data: CommonProductSlideData;
}

export interface CartSliceProp {
  cart: CartType[];
  tax: number;
}

export interface HoverButtonsProp {
  item: ProductItemInterface;
  setDataId: (id: number) => void;
  setOpenModal: (key: boolean) => void;
}

export interface ProductDetailsProp {
  item: ProductItemInterface;
}

export interface ProductModalInterfaceType {
  value: boolean;
  setOpenModal: (value: boolean) => void;
  dataId: undefined | number;
}

export interface ModalProductDetailsProp {
  singleProduct: ProductItemInterface;
}

export interface ModalQuantityProp {
  quantity: number;
  setQuantity: (key: number) => void;
}

export interface ModalButtonsProp {
  singleProduct: ProductItemInterface;
  quantity: number;
}

export interface CartQuantityButtonProp {
  item: CartType;
}

export interface InvoicePrintType {
  handlePrint?: () => void;
}

export interface AddProductSliceType {
  navId: number;
  tabId: number;
  formValue: any;
}

export interface CheckoutFormType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  chech: boolean;
}

export interface AllTransactionType {
  _id: string;
  merchant_id: {
    _id: string,
    first_name: string,
    last_name: string
  },
  dealer_id: {
    _id: string,
    first_name: string,
    last_name: string
  },
  currency: {
    _id: string,
    currency_id: string,
    currency_code: string,
    currency_name: string,
    symbol: string,
    country: string
  },
  first_name: any;
  last_name: any;
  final_amount: number;
  transactionid: number;
  status: any;
  transaction_id: string;
  type: any;
  main_amount: string;
  // dealer_commission: string;
  // dealer_commission_rate: string;
  // admin_commission: string;
  // admin_commission_rate: string;
  trans_unique_id: string;
  status_description: string;
  createdAt: string;
}

export interface TransactionType {
  _id: string;
  merchant_id: {
    _id: string,
    first_name: string,
    last_name: string
  },
  dealer_id: {
    _id: string,
    first_name: string,
    last_name: string
  },
  currency: {
    _id: string,
    currency_id: string,
    currency_code: string,
    currency_name: string,
    symbol: string,
    country: string
  },
  first_name: any;
  last_name: any;
  final_amount: number;
  transactionid: number;
  status: any;
  transaction_id: string;
  type: any;
  main_amount: string;
  dealer_commission: string;
  dealer_commission_rate: string;
  admin_commission: string;
  admin_commission_rate: string;
  trans_unique_id: string;
  status_description: string;
  createdAt: string;
}

export interface ContactListType {
  _id: string;
  full_name: string;
  subject: string;
  ticketNo: number;
  message: string;
  is_open: number;
}