import { Button, Box, Spinner } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { Image } from '../../models/Image';

interface GetImagesParams {
  pageParam?: number;
}

interface RequestResponse {
  data: Image[];
  after: string | null;
}

async function getImages({
  pageParam = 0,
}: GetImagesParams): Promise<RequestResponse> {
  const response = await api.get(`/api/images`, {
    params: {
      after: pageParam,
    },
  });

  return response.data;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, {
    getNextPageParam: result => {
      return result.after;
    },
  });

  const formattedData = useMemo(() => {
    if (!data) return [];

    return data.pages.reduce((imagesAccumulator, page) => {
      return [...imagesAccumulator, ...page.data];
    }, [] as Image[]);
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <>
            <Button onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          </>
        )}
      </Box>
    </>
  );
}
