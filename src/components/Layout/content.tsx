import React, { ReactNode } from "react";
import cls from "classnames";
export interface IContentProps {
  children?: ReactNode;
  className?: string;
}
export default function Content(props: IContentProps) {
  const { children, className } = props;
  const classNames = cls(className, "content");
  return <div className={classNames}>{children}</div>;
}
