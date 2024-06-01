import { InputType } from "reactstrap/types/lib/Input";

export interface CommonUserFooterType {
  listClass?: string;
}

export interface CommonUserFormGroupType {
  name:string,
  title: string;
  placeholder?: string;
  type: InputType;
  defaultValue?: string
  disabled?: boolean;
  value?: any;
  onChange?: any;
  row?: number;
  nn?: any;
}

export interface userCardTypes {
  id: number;
  card_bg: string;
  avatar: string;
  name: string;
  userProfile: string;
  follower: string;
  following: string;
  totalPost: string;
}

export interface UserCardsFooterProp {
  item: userCardTypes;
}