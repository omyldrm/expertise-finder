"use client";

import Form from "next/form";

export function AutoSubmitForm({ id, action, children, className }: {
  id: string;
  action: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Form
      id={id}
      action={action}
      scroll={false}
      replace
      className={className}
      onChange={(e) => e.currentTarget.requestSubmit()}
    >
      {children}
    </Form>
  );
}
