export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'cool',
    button: {
      rounded: 'rounded-xl'
    },
    input: {
      rounded: 'rounded-xl',
    },
    select: {
      rounded: 'rounded-xl',
    },
    card: {
      rounded: 'rounded-2xl',
    },
    notification: {
      position: 'top-right',
      duration: 5000,
    },
    modal: {
      position: 'center',
    },
    table: {
      wrapper: 'relative overflow-x-auto',
      base: 'min-w-full table-fixed',
      divide: 'divide-y divide-gray-300 dark:divide-gray-700',
      thead: 'relative',
      tbody: 'divide-y divide-gray-200 dark:divide-gray-800',
      caption: 'sr-only',
      sortAscIcon: 'i-heroicons-bars-arrow-up-20-solid',
      sortDescIcon: 'i-heroicons-bars-arrow-down-20-solid',
      sortButton: {
        icon: 'i-heroicons-arrows-up-down-20-solid',
        trailing: true,
        square: true,
        color: 'gray',
        variant: 'ghost',
        class: '-m-1.5'
      },
      expandButton: {
        icon: 'i-heroicons-chevron-down',
        color: 'gray',
        variant: 'ghost',
        size: 'xs',
        class: '-my-1.5 align-middle'
      },
      checkbox: {
        color: 'primary'
      },
      progress: {
        color: 'primary',
        animation: 'carousel'
      },
      loadingState: {
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...'
      },
      emptyState: {
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.'
      },

      tr: {
        base: '',
        selected: 'bg-gray-50 dark:bg-gray-800/50',
        expanded: 'bg-gray-50 dark:bg-gray-800/50',
        active: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
      },
      th: {
        base: 'text-left rtl:text-right',
        padding: 'px-4 py-3.5',
        color: 'text-gray-900 dark:text-white',
        font: 'font-semibold',
        size: 'text-sm'
      },
      td: {
        base: 'whitespace-nowrap',
        padding: 'px-4 py-4',
        color: 'text-gray-500 dark:text-gray-400',
        font: '',
        size: 'text-sm'
      }, 
      expand: {
        icon: 'transform transition-transform duration-200'
      }


    }

  },
  nuxtIcon: {
    size: '24px',
    class: 'icon',
    aliases: {
      'nuxt': 'logos:nuxt-icon',
    }
  }
})