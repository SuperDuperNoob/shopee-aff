## `bc-custom-link` — Short-Link Generator

Shorten a URL for a specific Shopee page.

### Installation

1. Add your App ID and API key to lines 50–51 of `link.php`. Credentials are available from <https://affiliate.shopee.vn/open_api>.
2. Update the domain on lines 115 and 122 of `func.php`.

![Configuration example](https://i.imgur.com/Bc6X9ub.png)

### SQL table

```sql
CREATE TABLE `shopee_affiliate_link` (
  `id` int(11) NOT NULL,
  `us_id` varchar(128) DEFAULT NULL,
  `appid` varchar(64) DEFAULT NULL,
  `link` varchar(512) DEFAULT NULL,
  `tracking_link` varchar(256) DEFAULT NULL,
  `sub_id` varchar(512) DEFAULT NULL,
  `time_create` int(11) DEFAULT NULL,
  `ip` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `shopee_affiliate_link`
  ADD PRIMARY KEY (`id`);
```

**By Bcat95. Please credit the author when sharing.**
