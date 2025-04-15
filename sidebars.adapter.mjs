const walk = (itemOrItems, callback) => {
  if (Array.isArray(itemOrItems)) {
    itemOrItems.forEach((item) => {
      walk(item, callback)
    })
  } else {
    callback(itemOrItems)
    if ('items' in itemOrItems && Array.isArray(itemOrItems.items)) {
      walk(itemOrItems.items, callback)
    }
  }
}

export const officialNextJsDocsSidebarItemsAdapter = (items) => {
  const reduced = items.reduce((prev, current) => {
    //index.mdは先頭に
    if (current.id === 'index') {
      return [current, ...prev]
    }

    //Pages Routerは利用しない
    if (current.link?.id === 'pages/index') {
      return [...prev]
    }

    return [...prev, current]
  }, [])

  walk(reduced, (item) => {
    //各カテゴリのトップは折り畳み不可に
    if (
      [
        'index',
        'app/index',
        'app/getting-started/index',
        'app/guides/index',
        'app/building-your-application/index',
        'app/deep-dive/index',
        'app/api-reference/index',
        'architecture/index',
        'community/index',
      ].includes(item?.link?.id)
    ) {
      item.collapsible = false
    }
  })

  return reduced
}
