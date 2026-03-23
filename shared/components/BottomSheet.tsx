import BottomSheetLib, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetLib>(null);

  // Snap points: 70% de la pantalla abierto, cerrado fuera de vista
  const snapPoints = useMemo(() => ["70%"], []);

  // Animar apertura/cierre basado en `visible`
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Callback cuando se cierra desde el gesture
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Cerrado completamente
        onClose();
      }
    },
    [onClose],
  );

  if (!visible) return null;

  return (
    <BottomSheetLib
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </BottomSheetLib>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    backgroundColor: "#ddd",
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
