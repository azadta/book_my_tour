interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModel = ({
  isOpen,
  message,
  onClose,
  onConfirm,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm ">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400  "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600  "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
