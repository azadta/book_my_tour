import { type IPackage } from "../redux/package/packageSlice";
interface packageCardProps {
  pkg: IPackage;
}
const pkgCard = ({ pkg }: packageCardProps) => {
  let netPrice = pkg.amount;
  if (pkg.discount && pkg.discount > 0)
    netPrice = pkg.amount - (pkg.amount * pkg.discount) / 100;
  return (
    <div>
      <div
        key={pkg._id}
        className=" shadow rounded-xl overflow-hidden p-4 bg-sky-200 "
      >
        <div className="flex gap-2 text-sky-600">
          <p className="font-dosis">Explores:</p>
          <p className="text-sky-600 pb-5">
            {pkg.destinations
              .slice(0, 3)
              .map((destination) => destination.name)
              .join("•")}
          </p>
        </div>
        <img
          src={pkg.images?.[0]}
          alt={pkg.name}
          className="w-full h-40 object-cover"
        />
        <div className="p-4 bg-emerald-100">
          <h3 className="text-xl font-semibold text-sky-800 text-center">
            {pkg.name}
          </h3>
          <div className="flex justify-between items-start">
            <div className="flex items-end gap-1">
              {pkg.discount && pkg.discount > 0 ? (
                <div className="flex flex-col items-start gap-2">
                  <p className="text-lg  bg-sky-200 inline-block px-3 rounded-xl  text-sky-800 font-satisfy ">
                    {pkg.discount}% offer{" "}
                  </p>

                  <p className="text-xs line-through decoration-red-500 ml-2">
                    Rs. {pkg.amount}
                  </p>
                </div>
              ) : null}
              <p className="text-sm text-emerald-600 font-semibold">
                Rs. {netPrice.toFixed(2)}
              </p>
            </div>
            <div className="bg-emerald-200 text-emerald-800 px-2 py-1 text-sm rounded-2xl">{`${pkg.duration?.day} days - ${pkg.duration?.night} nights`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default pkgCard;
