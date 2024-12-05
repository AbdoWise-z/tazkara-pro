"use client";

import React, {useEffect} from 'react';
import EditUserModal from "@/components/modals/edit-user-modal";

const ModelProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <EditUserModal />
    </>
  );
};

export default ModelProvider;