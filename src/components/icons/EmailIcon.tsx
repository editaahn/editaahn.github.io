import React from 'react';

type EmailIconProps = {
  fill: string;
};

export const EmailIcon = ({ fill }: EmailIconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.15 10.9L22 4.35V3.75C22 3.6 21.9 3.5 21.75 3.5H2.25C2.1 3.5 2 3.6 2 3.75V4.35L11.85 10.9C11.95 10.95 12.05 10.95 12.15 10.9Z" fill={fill ?? '#000'} />
    <path d="M2.25 20.5H21.75C21.9 20.5 22 20.4 22 20.25V7.34999L12.15 13.9C12.05 13.95 11.95 13.95 11.85 13.9L2 7.34999V20.25C2 20.4 2.1 20.5 2.25 20.5Z" fill={fill ?? '#000'} />
  </svg>
);