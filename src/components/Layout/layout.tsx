import React, { ReactNode } from "react";
import cls from "classnames";
export interface ILayoutProps {
  children?: ReactNode;
  className?: string;
}
export default function Layout(props: ILayoutProps) {
  const { children, className } = props;
  const classNames = cls(className, "layout");
  return <div className={classNames}>{children}</div>;
}
