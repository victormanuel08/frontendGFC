import _ from 'lodash';

export type Pagination = {
  page: number; // Acá se guarda el número de página actual
  pageSize: number; // Acá se guarda la cantidad de resultados por página
  resultsCount: number; // Acá se guarda la cantidad total de resultados
};

export interface PaginatedApiResult<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export const usePaginatedFetch = <T>(url: string | Ref<string>, filters = ref({}) as Ref | ComputedRef) => {
  const search = ref("");
  // Este composable ya le resuelve todo el asunto de la paginacion, no necesita que se le pase la pagina
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    resultsCount: 0,
  } as Pagination);

  const { page, pageSize, resultsCount } = toRefs(pagination);

  const sanitizedFilters = computed(() => {
    const sanitized = _.pickBy(filters.value, (value: any) => Boolean(value));
    console.log('Sanitized Filters:', sanitized); // Verifica que los filtros estén correctos.
    return sanitized;
  });

  const query = computed(() => {
    const queryParams = {
      page: page.value,
      page_size: pageSize.value,
      search: search.value,
      ...sanitizedFilters.value,
    };
    console.log('Generated Query:', queryParams); // Verifica cómo se construye la consulta.
    return queryParams;
  });

  const {
    data: rawData,
    pending,
    status,
    refresh,
  } = useFetch<PaginatedApiResult<T>>(url, {
    method: "GET",
    query,
  });
  

  // Seguimiento del estado de la paginación y los resultados
  watchEffect(() => {
    console.log('Pagination Changed:', pagination); // Verifica si la paginación se actualiza correctamente.
    resultsCount.value = rawData.value?.count || 0;
  });

  // Verifica si el valor de búsqueda está cambiando correctamente
  watch(search, () => {
    console.log('Search Changed:', search.value); // Verifica si el valor de búsqueda cambia correctamente.
    page.value = 1;
  });

  const data = computed(() => {
    console.log('Raw Data from API:', rawData.value); // Verifica la respuesta de la API.
    return rawData.value?.results || [];
  });

  // Monitorear la carga de datos
  console.log('Pending:', pending.value); // Verifica el estado de la carga de datos.
  console.log('Status:', status.value); // Verifica el estado de la petición.

  return {
    data,
    pageSize,
    page,
    status,
    resultsCount,
    filters,
    pending,
    search,
    refresh,
    pagination,
    usePaginatedFetch
  };
};
