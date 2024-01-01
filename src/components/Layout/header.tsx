import React, { ReactNode } from "react";
import cls from "classnames";
export interface IHeaderProps {
  children?: ReactNode;
  className?: string;
}
export default function Header(props: IHeaderProps) {
  const { children, className } = props;
  const classNames = cls(className, "header");
  return <div className={classNames}>{children}</div>;
}
