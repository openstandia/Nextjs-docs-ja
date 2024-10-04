import MDXComponents from '@theme-original/MDXComponents'
import { Image } from '@site/src/components/image'
import { AppOnly, PagesOnly } from '@site/src/components/only'
import { Check, Cross } from '@site/src/components/icons'
import { DocCardList } from '@site/src/components/doc'
import { NextJsVersion } from '@site/src/components/version'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

export default {
  ...MDXComponents,
  Image,
  AppOnly,
  PagesOnly,
  Cross,
  Check,
  DocCardList,
  NextJsVersion,
  Tabs,
  TabItem,
}
