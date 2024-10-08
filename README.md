
[![Build Status](https://travis-ci.org/bentonow/bento-wordpress-sdk.svg?branch=master)](https://travis-ci.org/bentonow/bento-wordpress-sdk)

> [!TIP]
> Need help? Join our [Discord](https://discord.gg/ssXXFRmt5F) or email jesse@bentonow.com for personalized support.

The Bento WordPress & WooCommerce SDK makes it quick and easy to build an excellent eCommerce analytics experience in your WordPress site. We provide powerful and customizable event tracking that can be used out-of-the-box to monitor your users' behavior, manage subscribers, and track orders. We also expose low-level APIs so that you can build fully custom experiences.

Get started with our [📚 integration guides](https://docs.bentonow.com), or [📘 browse the SDK reference](https://docs.bentonow.com/subscribers).

🐶 Battle-tested on Bento Production!


Table of contents
=================

<!--ts-->
* [Features](#features)
* [Requirements](#requirements)
* [Caching](#caching)
* [Getting started](#getting-started)
    * [Installation](#installation)
* [Modules](#modules)
* [Things to Know](#things-to-know)
* [Contributing](#contributing)
* [License](#license)
<!--te-->

## Features

* **WooCommerce integration**: Track orders, refunds, cancellations, and shipments automatically.
* **WooCommerce Subscriptions support**: Monitor subscription lifecycles including creation, activation, cancellation, and renewals.
* **Easy Digital Downloads integration**: Track purchases, downloads, and refunds for digital products.
* **Lifetime Value (LTV) tracking**: Automatically calculate and update customer LTV based on orders and refunds.
* **Event tracking**: Capture key eCommerce events to power your marketing automation.
* **WordPress compatibility**: Seamless integration with WordPress sites.

## Requirements

The Bento WordPress & WooCommerce SDK requires:
- WordPress 5.0+
- WooCommerce 3.0+ (for WooCommerce features)
- Easy Digital Downloads 2.0+ (for EDD features)
- Bento Account for a valid **SITE_UUID**.

## Caching

For now, Bento's script is personalized and dynamic meaning that it changes on every page load. This is necessary to power our on-page personalization engine and a lot of the magic that's under the hood. Please make sure you exclude your custom Bento.js script if you are using a caching plugin such as WP Rocket or SuperCache.

## Getting started

### Installation

1. Download the Bento WordPress plugin.
2. Install and activate the plugin in your WordPress admin panel.
3. Add your Bento site key in the plugin settings.

## Modules

### WooCommerce

The SDK automatically tracks the following WooCommerce events:

#### Order Placed

```php
// Event: $OrderPlaced
// Triggered when an order is placed
// Increases the customer's LTV
```

#### Order Refunded

```php
// Event: $OrderRefunded
// Triggered when an order is refunded (partial or full)
// Decreases the customer's LTV
```

#### Order Cancelled

```php
// Event: $OrderCancelled
// Triggered when an order status is changed to 'cancelled'
```

#### Order Shipped

```php
// Event: $OrderShipped
// Triggered when an order status is changed to 'completed'
```

### WooCommerce Subscriptions

The SDK tracks these subscription-related events:

#### Subscription Created

```php
// Event: $SubscriptionCreated
// Triggered when a new subscription is created
```

#### Subscription Activated

```php
// Event: $SubscriptionActive
// Triggered when a subscription becomes active
```

#### Subscription Cancelled

```php
// Event: $SubscriptionCancelled
// Triggered when a subscription is cancelled by an admin
```

#### Subscription Expired

```php
// Event: $SubscriptionExpired
// Triggered when a subscription reaches the end of its term
```

#### Subscription On Hold

```php
// Event: $SubscriptionOnHold
// Triggered when a subscription status changes to 'on-hold'
```

#### Subscription Trial Ended

```php
// Event: $SubscriptionTrialEnded
// Triggered when a subscription's trial period ends
```

#### Subscription Renewed

```php
// Event: $SubscriptionRenewed
// Triggered when a subscription renewal payment is processed
```

### Easy Digital Downloads

The SDK tracks these EDD events:

#### Download Purchased

```php
// Event: $DownloadPurchased
// Triggered when a payment is completed for a download
```

#### Download Downloaded

```php
// Event: $DownloadDownloaded
// Triggered when a user downloads a purchased item
```

#### Download Refunded

```php
// Event: $DownloadRefunded
// Triggered when a download is refunded (partial or full)
```

## Things to Know

1. The SDK automatically tracks key eCommerce events without additional configuration.
2. Customer Lifetime Value (LTV) is automatically calculated based on orders and refunds.
3. The Bento script is dynamic and personalized, so it should be excluded from caching plugins.
4. Subscription events are only triggered for admin-initiated actions, not customer-initiated ones.
5. The SDK supports both WooCommerce and Easy Digital Downloads for comprehensive eCommerce tracking.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

The Bento SDK for WordPress & WooCommerce is available as open source under the terms of the [MIT License](LICENSE).