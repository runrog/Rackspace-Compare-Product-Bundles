(($) => {
  $.fn.rsBundleTable = function rsBundleTable() {
    const $bundle = $(this);
    $bundle.each(function initPlugin() {
      const $this = $(this);
      const $keys = $this.find('.rsBundles-centerKeys');
      const $cards = $this.find('.rsBundles-cardCompare-container');
      const $bullets = $this.find('.rsBundles-bullets');
      const $leftBtn = $this.find('[data-rs-bundles="left-btn"]');
      const $rightBtn = $this.find('[data-rs-bundles="right-btn"]');
      // plugin actions
      const actions = {
        activeIndex: 0,
        totalKeys: $keys.find('.rsBundles-centerKeys-changeable').length,
        moveKeysBack() {
          if (this.activeIndex > 0) {
            this.activeIndex -= 1;
            $rightBtn.parent().addClass('rsBundles-activeArrow');
          }
          if (this.activeIndex === 0) {
            // remove visibility on back btn
            $leftBtn.parent().removeClass('rsBundles-activeArrow');
          }
        },
        moveKeysNext() {
          if (this.activeIndex < (this.totalKeys - 1)) {
            this.activeIndex += 1;
            $leftBtn.parent().addClass('rsBundles-activeArrow');
          }
          if (this.activeIndex === (this.totalKeys - 1)) {
            // remove visibility on next btn
            $rightBtn.parent().removeClass('rsBundles-activeArrow');
          }
        },
        swapContent($content) {
          const i = actions.activeIndex;
          const $items = $content.children();
          $items.removeClass('rsBundles-active');
          $items.eq(i).addClass('rsBundles-active');
          $bullets.children().removeClass('rsBundles-bullet-active');
          $bullets.children().eq(i).addClass('rsBundles-bullet-active');
        },
        makeBullets() {
          for (let i = 0; i < this.totalKeys; i += 1) {
            let active = '';
            if (i === 0) {
              active = 'rsBundles-bullet-active';
            }
            $bullets.append(`<span class="rsBundles-bullet ${active}"></span>`);
          }
        },
        loopCards($c) {
          $c.each(function next() {
            const $el = $(this);
            const attr = $el.parent().attr('data-rs-bundles');
            if (!attr && attr !== 'no-slide') {
              actions.swapContent($el);
            }
          });
        },
      };

      actions.makeBullets();

      $rightBtn.click((e) => {
        e.preventDefault();
        // shift left for next effect
        actions.moveKeysNext();
        actions.swapContent($keys);
        actions.loopCards($cards);
      });

      $leftBtn.click((e) => {
        e.preventDefault();
        // shift right for next effect
        actions.moveKeysBack();
        actions.swapContent($keys);
        actions.loopCards($cards);
      });
    });
    return this;
  };
})(jQuery);

$('.rsBundles-container').rsBundleTable();
