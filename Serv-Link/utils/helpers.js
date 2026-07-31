function formatarPreco(valor) {
  if (valor === null || valor === undefined || valor === "") return "0 MZN";
  return `${Number(valor).toLocaleString("pt-MZ")} MZN`;
}

function formatarData(dataString) {
  if (!dataString) return "";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-MZ");
}

module.exports = { formatarPreco, formatarData };

