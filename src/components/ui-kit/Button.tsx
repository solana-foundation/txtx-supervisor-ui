import React, { ButtonHTMLAttributes } from 'react';

import classnames from './classnames';

import { CatalystButton, CatalystButtonProps } from './CatalystButton';

export enum ButtonSizes {
  s = 'small',
  m = 'medium',
  l = 'large',
  xl = 'extra-large',
  xxl = 'double-extra-large',
  xxxl = 'triple-extra-large',
}

export enum ButtonVariants {
  primary = 'primary',
  secondary = 'secondary',
  ghost = 'ghost',
  white = 'white',
  catalyst = 'catalyst',
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
  [ButtonVariants.ghost]: `
    bg-buttonGhostBg dark:bg-buttonGhostBg
    border-buttonGhostBorder dark:border-buttonGhostBorder hover:border-buttonGhostBorderHover
    shadow-none dark:shadow-none
    text-textButtonGhost dark:text-textButtonGhost
    font-epilogue
  `,
  [ButtonVariants.white]: `
    bg-buttonWhiteBg dark:bg-buttonWhiteBg hover:bg-buttonWhiteBgHover
    border-none dark:border-none
    shadow-none dark:shadow-none
    text-textButtonWhite dark:text-textButtonWhite
    font-epilogue
  `,
  [ButtonVariants.catalyst]: '',
};

const sizes = {
  [ButtonSizes.s]: `
    px-4 py-2 sm:px-4 sm:py-2 gap-4
    text-xs sm:text-xs
    leading-[16px] sm:leading-[16px]
    tracking-[0.24px] sm:tracking-[0.24px]
  `,
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
  [ButtonSizes.xl]: `
    p-5 sm:p-5 gap-4
    text-lg sm:text-lg
    leading-[22.742px] sm:leading-[22.742px]
    tracking-[0.36px] sm:tracking-[0.36px]
  `,
  [ButtonSizes.xxl]: `
    p-6 sm:p-6 gap-[21.429px]
    text-[30px] sm:text-[30px]
    leading-[34.286px] sm:leading-[34.286px]
    tracking-[0.6px] sm:tracking-[0.6px]
  `,
  [ButtonSizes.xxxl]: `
    p-7 sm:p-7 gap-[21.429px]
    text-[34.286px] sm:text-[34.286px]
    leading-[42.857px] sm:leading-[42.857px]
    tracking-[0.686px] sm:tracking-[0.686px]
  `,
};

const customSizesForGhostAndWhite = {
  [ButtonSizes.s]: `
    px-4 pt-[14px] pb-[10px] sm:px-4 sm:pt-[14px] sm:pb-[10px] gap-[10px]
    text-sm sm:text-sm font-medium
    tracking-[0.28px] sm:tracking-[0.28px]
  `,
  [ButtonSizes.m]: `
    px-4 pt-[16px] pb-[14px] sm:px-4 sm:pt-[16px] sm:pb-[14px]
    text-sm sm:text-sm font-medium
    tracking-[0.28px] sm:tracking-[0.28px]
  `,
  [ButtonSizes.l]: `
    px-5 pt-[19px] pb-[17px] sm:px-5 sm:pt-[19px] sm:pb-[17px] gap-[10px]
    text-base sm:text-base font-semibold
    tracking-[0.32px] sm:tracking-[0.32px]
  `,
  [ButtonSizes.xl]: `
    px-[22.7px] pt-[21.6px] pb-[19.3px] sm:px-[22.7px] sm:pt-[21.6px] sm:pb-[19.3px] gap-[11.371px]
    font-semibold
    tracking-[0.364px] sm:tracking-[0.364px]
  `,
  [ButtonSizes.xxl]: `
    px-[34.29px] pt-[30px] pb-[21.43px] sm:px-[34.29px] sm:pt-[30px] sm:pb-[21.43px] gap-[21.429px]
    font-medium
  `,
  [ButtonSizes.xxxl]: `
    px-[42.9px] pt-[40.71px] pb-[36.43px] sm:px-[42.9px] sm:pt-[40.71px] sm:pb-[36.43px] gap-[21.429px]
    font-semibold
  `,
};

const customSizesByType: Partial<Record<ButtonVariants, Partial<Record<ButtonSizes, string>>>> = {
  [ButtonVariants.ghost]: customSizesForGhostAndWhite,
  [ButtonVariants.white]: customSizesForGhostAndWhite,
};

interface IButtonProps {
  size?: ButtonSizes;
  variant?: ButtonVariants;
}

export type ButtonProps = IButtonProps & CatalystButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  size = ButtonSizes.m,
  variant = ButtonVariants.primary,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <CatalystButton
    className={
      variant !== ButtonVariants.catalyst
        ? classnames(
          `
            cursor-pointer
            rounded
            dark:after:content-none after:content-none
            dark:before:content-none before:content-none
            font-gt-america-mono font-normal
          `,
          sizes[size],
          customSizesByType?.[variant]?.[size],
          variants[variant],
          {
            'pointer-events-none': disabled,
          },
          className
        )
        : classnames(
          'cursor-pointer',
          className
        )
    }
    disabled={disabled}
    {...props}
  />
);
Button.ButtonVariants = ButtonVariants;
Button.ButtonSizes = ButtonSizes;
