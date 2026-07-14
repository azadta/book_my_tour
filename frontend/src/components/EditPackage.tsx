import PackageForm from "@/components/forms/PackageForm";
import Loading from "@/components/Loading";
import { useAdminEditPackage } from "@/hooks/useAdminEditPackage";
import { useOperatorEditPackage} from "@/hooks/useOperatorEditPackage";
import type { IPackageItem } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Props {
  role: "operator" | "admin";
}

const EditPackage = ({role}:Props) => {
  const { id } = useParams();

  const [packageData, setPackageData] = useState<IPackageItem>();
  const operatorHook=useOperatorEditPackage()
  const adminHook=useAdminEditPackage()
  const hook=role==='operator'?operatorHook:adminHook
  const {fetchPackage,loading} =hook
  useEffect(() => {
    const loadPackage = async () => {
      const data = await fetchPackage(id as string);
      setPackageData(data);
    };
    loadPackage();
  }, [id]);
  if (loading || !packageData) {
    return <Loading />;
  }
  return <PackageForm mode="edit" packageData={packageData} role={role} />;
};

export default EditPackage;
