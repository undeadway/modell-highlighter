const common = require("./../common");

const dftBuiltInVar = ['cat', 'chattr', 'chgrpchmod', 'chown', 'cksum', 'cmpdiff', 'diffstat', 'file', 'findgit', 'gitview', 'indent', 'cutln', 'less', 'locate',
	'lsattrmattrib', 'mc', 'mdel', 'mdirmktemp', 'more', 'mmove', 'mreadmren', 'mtools', 'mtoolstest', 'mvod', 'paste', 'patch', 'rcprm', 'slocate', 'split', 'eject',
	'teetmpwatch', 'touch', 'umask', 'whichcp', 'whereis', 'mcopy', 'mshowfatrhmask', 'scp ', 'awk', 'readupdatedb', 'col', 'colrm', 'commcsplit', 'ed', 'egrep', 'id',
	'exfgrep', 'fmt', 'fold', 'grepispell', 'jed', 'joe', 'joinlook', 'mtype', 'pico', 'rgrepsed', 'sort', 'spell', 'trexpr', 'uniq', 'wc', 'let ', 'lprm', 'lpr', 'w',
	'lpqlpd', 'bye', 'ftp', 'uutouupick', 'uucp', 'uucico', 'tftpncftp', 'ftpshut', 'ftpwho', 'insmodkbdconfig', 'ftpcount ', 'dirsdu', 'edquota', 'mcdmdeltree', 'wall',
	'mdu', 'mkdir', 'mlabelmmd', 'mrd', 'mzip', 'pwdquota', 'mount', 'mmount', 'rmdirrmt', 'stat', 'tree', 'umountls', 'quotacheck', 'quotaoff', 'lndirrepquota', 'cd',
	'quotaon', 'badblocks', 'cfdisk', 'dde2fsck', 'ext2ed', 'fsck', 'fsck.minixfsconf', 'fdformat', 'hdparm', 'mformatmkbootdisk', 'mkdosfs', 'mke2fs', 'mkfs', 'df',
	'mkfs.ext2mkfs.msdos', 'mkinitrd', 'mkisofs', 'mkswapmpartition', 'swapon', 'symlinks', 'syncmbadblocks', 'mkfs.minix', 'fsck.ext2', 'fdisklosetup', 'sfdisk', 'su',
	'swapoff', 'apachectl', 'arpwatch', 'dipgetty', 'mingetty', 'uux', 'telnetuulog', 'uustat', 'ppp-off', 'netconfignc', 'httpd', 'ifconfig', 'minicommesg', 'dnsconf',
	'netstatping', 'pppstats', 'samba', 'setserialtalk', 'traceroute', 'tty', 'newaliasesuuname', 'netconf', 'write', 'statserialefax', 'pppsetup', 'tcpdump', 'dump',
	'ytalkcu', 'smbd', 'testparm', 'smbclientshapecfg', 'adduser', 'chfn', 'useradddate', 'exit', 'finger', 'fwhiossleep', 'suspend', 'groupdel', 'groupmodhalt', 'sudo',
	'kill', 'last', 'lastblogin', 'logname', 'logout', 'psnice', 'procinfo', 'top', 'pstreereboot', 'rlogin', 'rsh', 'sliploginscreen', 'shutdown', 'rwho', 'sudogitps',
	'swatch', 'tload', 'logrotateuname', 'chsh', 'userconf', 'userdelusermod', 'vlock', 'who', 'whoamiwhois', 'newgrp', 'renice', 'suskill', 'free', 'reset', 'sndconfig',
	'clear', 'aliasdircolors', 'aumix', 'bind', 'chrootclock', 'crontab', 'declare', 'depmoddmesg', 'enable', 'eval', 'exportpwunconv', 'grpconv', 'rpm', 'apmd', 'unarj',
	'lilo', 'liloconfig', 'lsmodminfo', 'set', 'modprobe', 'ntsysvmouseconfig', 'passwd', 'pwconv', 'rdateresize', 'rmmod', 'grpunconv', 'modinfotime', 'setup', 'lha',
	'setenvsetconsole', 'timeconfig', 'ulimit', 'unsetchkconfig', 'hwclock', 'mkkickstartfbset', 'unalias', 'SVGATextMode', 'ar', 'bunzip2', 'bzip2bzip2recover', 'gunzip',
	'compresscpio', 'uuencode', 'gzexegzip', 'restore', 'taruudecode', 'unzip', 'zip', 'zipinfo', 'setleds', 'loadkeys', 'rdevdumpkeys', 'MAKEDEV'
];
const dftBuiltInFunc = [];

common.addLang([{ name: 'SHELL' }], null, {

}, ['case', 'do', 'done', 'elif', 'else', 'esac', 'if', 'for', 'function', 'if', 'in', 'then', 'time', 'until', 'while'
		//,'','','','','','','','','','','','','','','','','','','','',''
	]);