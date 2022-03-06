import React from 'react';

export interface CardPropsType {
  title: string,
  description: string,
  thumbnail: string,
  three_dimen_object_blob_storage: string,
  objectname: string,
  tags: string[]
}

export interface TagType {
  value: string,
  label: string
}