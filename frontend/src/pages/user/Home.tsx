import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import { usePackageCategories } from "../../hooks/usePackageCategories";
import { fetchPackages, type IPackage } from "../../redux/package/packageSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import PackageCard from "../../components/PackageCard";

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
        <h2 className="text-2xl font-bold text-emerald-800 bg-linear-to-r from-emerald-200 to-sky-200 rounded-lg shadow px-6 py-2 mb-6 capitalize font-caveat ">
          {category.name.replace("-", " ")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-15">
          {filtered.map((pkg) => <PackageCard pkg={pkg}/>)}
        </div>
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
