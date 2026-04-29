import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { usePackageCategories } from "../../hooks/usePackageCategories";
import { fetchPackages, type IPackage } from "../../redux/package/packageSlice";
import Pagination from "../../components/Pagination";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerPage = 6;

  const dispatch = useDispatch<AppDispatch>();
  const {
    data: packages = [],
    status,
    totalCount,
  } = useSelector((state: RootState) => state.package);
  const totalPages = Math.ceil(totalCount / resultPerPage) || 1;
  const {
    categories,
    error: categoryError,
    loading: categoryLoading,
  } = usePackageCategories();
  useEffect(() => {
    dispatch(fetchPackages({ page: currentPage, limit: resultPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  console.log("packages", packages);

  const renderCategory = (category: { _id: string; name: string }) => {
    const filtered = packages.filter((pkg: IPackage) =>
      typeof pkg.category === "object"
        ? pkg.category._id === category._id
        : pkg.category === category._id,
    );
    if (filtered.length === 0) return null;

    return (
      <div className="mb-16" key={category._id}>
        <h2 className="text-2xl font-bold text-black bg-linear-to-r from-green-200 to-blue-200 rounded-lg shadow px-6 py-2 mb-6 capitalize ">
          {category.name.replace("-", " ")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white shadow rounded-xl overflow-hidden "
            >
              <img
                src={pkg.images?.[0]}
                alt={pkg.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 bg-green-100">
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p>Rs. {pkg.amount}</p>
              </div>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {status === "loading" && <p>...Loading packages</p>}
      {status === "failed" && <p>...Failed to load packages.</p>}
      {categoryLoading && <p>...Loading categories</p>}
      {categoryError && <p>{categoryError}</p>}
      {status === "succeeded" &&
        categories.map((category) => renderCategory(category))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
