import Loading from "@/components/Loading";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useWishlist } from "@/hooks/useWishlist";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Check,
  MapPin,
  Pencil,
  Share2,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const {
    setActiveGroup,
    activeGroup,
    handleShare,
    copiedToken,
    noteText,
    setNoteText,
    handleAddNote,
    handleEditGroup,
    handleDeleteGroup,
    handleEditNote,
    handleDeleteNote,
    groups,
    loading,
  } = useWishlist();
  const navigate = useNavigate();
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupTitleInput, setGroupTitleInput] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTextInput, setNoteTextInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => Promise<void>>(
    () => async () => {},
  );

  const calculateGroupTotal = (packages: any[]) => {
    return packages.reduce((acc, pkg) => {
      const price = pkg.discount
        ? Math.round(pkg.amount * (1 - pkg.discount / 100))
        : pkg.amount;
      return acc + price;
    }, 0);
  };

  const openConfirmationModel = (
    message: string,
    action: () => Promise<void>,
  ) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalOpen(true);
  };
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 ">
              Saved Wishlists
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Organize travel bundles, take notes, and share with trip partners.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">
              Your Folders
            </h3>
            {groups.map((group) => {
              const isActive = activeGroup._id === group?._id;
              const isEditing = editingGroupId === group._id;
              return (
                <div
                  key={group._id}
                  className={`group relative w-full p-4 rounded-2xl transition-all flex justify-between items-center ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white  hover:bg-gray-100 text-gray-800 border border-gray-100 "}`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={groupTitleInput}
                        onChange={(e) => setGroupTitleInput(e.target.value)}
                        className="w-full text-sm p-1 rounded border border-gray-300 text-white focus:outline-none "
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          handleEditGroup(group._id, groupTitleInput);
                          setEditingGroupId(null);
                        }}
                        className="p-1 hover:text-emerald-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingGroupId(null)}
                        className="p-1 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveGroup(group)}
                        className={`text-left flex-1`}
                      >
                        <h4 className="font-bold text-base line-clamp-1">
                          {group.title}
                        </h4>

                        <p
                          className={`text-xs mt-1 ${activeGroup?._id === group._id ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {group.packages.length} Packages
                        </p>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGroupId(group._id);
                            setGroupTitleInput(group.title);
                          }}
                          className={`p-1 rounded hover:bg-black/10 ${isActive ? "text-white" : "text-gray-500"}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openConfirmationModel(
                              "Are you sure want to delete?",
                              async () => {
                                await handleDeleteGroup(group._id);
                              },
                            );
                          }}
                          className={`p-1 rounded hover:bg-black/10 ${isActive ? "text-white" : "text-gray-500"}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {activeGroup && (
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4 ">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 ">
                    {activeGroup.title}
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    Group Total estimated budget
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs text-gray-400 uppercase font-semibold ">
                      Total cost
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      Rs{" "}
                      {calculateGroupTotal(activeGroup.packages).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      handleShare();
                      e.currentTarget.blur();
                    }}
                    className="flex items-center gap-2 bg-blue-50 focus:outline-none  text-blue-600 hover:bg-blue-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedToken ? "Link Copied!" : "Share Group"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGroup.packages.map((pkg: any) => (
                  <div
                    key={pkg._id}
                    onClick={() =>
                      navigate(FRONTEND_ROUTES.USER.PACKAGE_DETAILS(pkg._id))
                    }
                    className="bg-white hover:cursor-pointer rounded-2xl border border-gray-100 overflow-hidden shadow-xs p-4 flex gap-4"
                  >
                    <img
                      src={pkg.images?.[0]}
                      alt={pkg.name}
                      className="w-24 h-24 rounded-xl object-cover "
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {pkg.name}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 gap-1 mt-1 ">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          {pkg.destinations?.[0]?.name}
                        </div>
                      </div>

                      <div className="text-sm font-black text-gray-900">
                        Rs{" "}
                        {(pkg.discount
                          ? Math.round(pkg.amount * (1 - pkg.discount / 100))
                          : pkg.amount
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 ">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Trip Notes
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add thoughts"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {activeGroup.notes?.map((note: any) => {
                    const isEditing = editingNoteId === note._id;
                    return (
                      <div
                        key={note._id}
                        className="bg-amber-50/60 border border-amber-100/80 p-3.5 rounded-xl text-sm text-amber-900 flex items-center justify-between gap-3 group "
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="text"
                              value={noteTextInput}
                              onChange={(e) => setNoteTextInput(e.target.value)}
                              className="w-full bg-white text-sm p-1 rounded border border-amber-200 text-gray-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                handleEditNote(note._id, noteTextInput);
                                setEditingNoteId(null);
                              }}
                              className="text-emerald-700  hover:text-emerald-900"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="text-red-700  hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 ">{note.text}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ">
                              <button
                                onClick={() => {
                                  setEditingNoteId(note._id);
                                  setNoteTextInput(note.text);
                                }}
                                className={`p-1 text-amber-700 hover:text-amber-950`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  openConfirmationModel(
                                    "Are you sure you want to delete?",
                                    async () => {
                                      handleDeleteNote(note._id);
                                    },
                                  );
                                }}
                                className={`p-1 text-red-600 hover:text-red-800`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={async () => {
          await modalAction();
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default Wishlist;
