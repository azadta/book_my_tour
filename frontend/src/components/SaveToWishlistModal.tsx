import type { IWishlistGroup } from "@/interfaces/interfaces";
import { Check, FolderPlus, Heart, Plus, X } from "lucide-react";
import { useState } from "react";



interface SaveToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: IWishlistGroup[];
  packageId: string;
  onToggleGroup: (groupId: string) => void;
  onCreateGroup: (title: string) => Promise<void>;
}

const SaveToWishlistModal: React.FC<SaveToWishlistModalProps> = ({
  isOpen,
  groups,
  onClose,
  onCreateGroup,
  onToggleGroup,
  packageId,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    await onCreateGroup(newTitle);
    setNewTitle("");
    setIsCreating(false);
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in duration-200 ">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">
              Save to Wish List
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1"
          >
            <X />
          </button>
        </div>

        <div className="py-4 px-1 space-y-3 max-h-60 overflow-y-auto">
          {groups.map((group) => {
            const isSaved = group.packages.some(
              (p) => (typeof p === "string" ? p : p._id) === packageId,
            );
            return (
              <button
                key={group._id}
                onClick={(e) => {
                  onToggleGroup(group._id);
                  e.currentTarget.blur();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left outline-none focus:outline-none  transition-all ${isSaved ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold" : "border-gray-100 hover:border-gray-200 bg-gray-50/50 text-gray-700 "}`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold">{group.title}</span>
                  {isSaved && (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      Added to group
                    </span>
                  )}
                </div>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-xs">
                  {isSaved ? (
                    <Check className="w-4 h-4 text-emerald-500 " />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600 py-3 rounded-2xl text-sm font-medium transition-colors mt-2 "
          >
            <FolderPlus className="w-4 h-4" /> Create New Wishlist Group
          </button>
        ) : (
          <form onSubmit={handleCreateGroup} className="mt-3 space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-1/2 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 "
              >
                {loading ? "Creating" : "Create Folder"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SaveToWishlistModal;
