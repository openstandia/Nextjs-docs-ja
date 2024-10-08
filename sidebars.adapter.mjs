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
    //index.mdは非表示
    if (current.id === 'index') {
      return [...prev]
    }

    //Getting Startedにindexの内容を表示する
    if (current?.link?.id === 'getting-started/index') {
      current.link = { type: 'doc', id: 'index' }
    }

    //AppRouterのカテゴリは作らず、その配下をサイドバーに表示する
    /*
    if (current.link?.id === 'app/index') {
      const children = current.items
      return [...prev, ...children]
    }
     */

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
        'app/building-your-application/index',
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
