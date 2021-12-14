exports.capitalizeFirstLetter =  (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

exports.monitor_types = {
  "uptime_monitor" : "Uptime monitor", // 
  "url_monitor" : "URL monitor", // 
  "tcp_monitor" : "TCP monitor", // 
  "cpu_monitor" : "CPU monitor", // 3 state
  "disk_monitor" : "Disk monitor", // 3 state
  "file_monitor" : "File monitor", // 3 state
  "load_monitor" : "Load monitor", // 
  "swap_monitor" : "Swap monitor", // 
  "inode_monitor" : "Inode monitor", // 
  "service_monitor" : "Service monitor", // 
  "cron_monitor" : "Cron monitor", // 
  "snmp_monitor" : "SNMP monitor", // 
}

exports.binary_monitors = {
  "uptime_monitor" : true,
  "url_monitor" : true,
  "tcp_monitor" : true,
  "cpu_monitor" : false,
  "disk_monitor" : false,
  "file_monitor" : false,
  "service_monitor" : true,
  "snmp_monitor" : false,
  "inode_monitor" : false,
  "cron_monitor" : true,
  "load_monitor" : false,
  "swap_monitor" : false,
}