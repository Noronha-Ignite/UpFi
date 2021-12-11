import {
  Modal,
  ModalOverlay,
  ModalContent,
  Image,
  Link,
  Flex,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={900} maxH={600}>
        <Image src={imgUrl} w="fit-content" h="fit-content" />
        <Flex p="2" as="footer" w="100%" bg="pGray.800">
          <Link target="_blank" href={imgUrl}>
            Abrir original
          </Link>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
