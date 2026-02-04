import React, { ButtonHTMLAttributes } from 'react';
import * as Headless from '@headlessui/react';

import classnames from './classnames';

export enum ButtonSizes {
  m = 'medium',
  l = 'large',
}

export enum ButtonVariants {
  primary = 'primary',
  secondary = 'secondary',
}

const variants = {
  [ButtonVariants.primary]: `
    bg-buttonPrimaryBorder dark:bg-buttonPrimaryBorder hover:bg-buttonPrimaryHover
    border-buttonPrimaryBorder dark:border-buttonPrimaryBorder
    shadow-buttonPrimary dark:shadow-buttonPrimary
    text-textButtonPrimary dark:text-textButtonPrimary
  `,
  [ButtonVariants.secondary]: `
    bg-buttonSecondary dark:bg-buttonSecondary
    border-none dark:border-none
    shadow-none dark:shadow-none
    text-textButtonSecondary dark:text-textButtonSecondary
    hover:bg-buttonSecondaryHover
  `,
};

const sizes = {
  [ButtonSizes.m]: `
    px-4 py-3 sm:px-4 sm:py-3 gap-4
    text-xs sm:text-xs
    leading-[18px] sm:leading-[18px]
    tracking-[0.24px] sm:tracking-[0.24px]
  `,
  [ButtonSizes.l]: `
    p-4 sm:p-4 gap-4
    text-sm sm:text-sm
    leading-[20px] sm:leading-[20px]
    tracking-[0.28px] sm:tracking-[0.28px]
  `,
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  variant?: ButtonVariants;
  children: React.ReactNode;
}

export const Button = ({
  size = ButtonSizes.m,
  variant = ButtonVariants.primary,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <Headless.Button
    className={classnames(
      // Base layout
      'relative isolate inline-flex items-center justify-center gap-x-2 border',
      // Focus ring
      'focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500',
      // Disabled
      'data-[disabled]:opacity-50',
      // Button-specific base
      'cursor-pointer rounded font-gt-america-mono font-normal',
      // Size
      sizes[size],
      // Variant
      variants[variant],
      // Disabled pointer
      { 'pointer-events-none': disabled },
      // Consumer overrides
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </Headless.Button>
);

Button.ButtonVariants = ButtonVariants;
Button.ButtonSizes = ButtonSizes;
