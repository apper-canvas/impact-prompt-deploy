import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      case "draft":
        return "draft";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;