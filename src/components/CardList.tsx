import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Image } from '../../models/Image';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface CardsProps {
  cards: Image[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleViewImage = (imageUrl: string): void => {
    setSelectedImageUrl(imageUrl);
    onOpen();
  };

  return (
    <>
      <SimpleGrid minChildWidth={290}>
        {cards.map(card => (
          <Card viewImage={handleViewImage} key={card.id} data={card} />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedImageUrl}
      />
    </>
  );
}
