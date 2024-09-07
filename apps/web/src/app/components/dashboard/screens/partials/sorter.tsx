/*const AssetSorter: FC<FilterIProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = useMemo(() => {
    const options = ["Name A-Z", "Name Z-A"];
    if (activeTab === TradeAssetType.crypto) {
      options.unshift("Profitability");
    } else if (activeTab === TradeAssetType.forex) {
      options.unshift("24-hr changes (high to low)");
      options.unshift("24-hr changes (low to high)");
    } else {
      options.unshift("Ask Price (low to high)");
      options.unshift("Ask Price (high to low)");
    }
    return options;
  }, [activeTab]);

  const action = (value: string) => {}

  return (
    <>
      <i className="fa-solid fa-arrow-up-short-wide" style={{ cursor: "pointer" }}
         onClick={() => setIsOpen(!isOpen)}></i>
      {isOpen && (
        <Dropdown dropdownRef={dropdownRef} options={options} setIsOpen={setIsOpen} title={'Sort by'} default={"All"} action={action}/>
      )}
    </>
  )
}*/
