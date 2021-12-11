import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type UploadImageParams = {
  url: string;
  title: string;
  description: string;
};

async function uploadImageRequest(params: UploadImageParams): Promise<any> {
  const { url, title, description } = params;

  const { data } = await api.post('/api/images', {
    url,
    title,
    description,
  });

  return data;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const queryClient = useQueryClient();
  const { mutateAsync: uploadImage } = useMutation(uploadImageRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('images');
    },
  });

  const acceptedFileFormats = ['image/jpeg', 'image/png', 'image/gif'];

  const formValidations = {
    image: {
      required: true,
      validate: {
        lessThan10MB: (files: File) => {
          return files[0].size / 1024 > 10;
        },
        acceptedFormatts: (file: File) =>
          !acceptedFileFormats.includes(file.type),
      },
    },
    title: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: true,
      maxLength: 65,
    },
  };

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, string>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });

        return;
      }

      const { title, description } = data;

      await uploadImage({
        url: imageUrl,
        title,
        description,
      });

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
