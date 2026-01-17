$(document).ready(function () {
	var $cover = $('.worker-page-top-with-cover'),
		$textContent = $('.worker-page-top .text-content'),
		$expandTitle = $('.expand-title', $textContent),
		$ul = $('ul', $textContent);

	// ajax по основным категориям
	$(document).on('click', 'a.worker-category-ajax-link', function () {
		var $a = $('a[href="' + $(this).attr('href') + '"]', $textContent).first();
		if ($a.length) {
			var top = $('ul', $textContent).offset().top - 10;
			if ($(document).scrollTop() > top + 150) {
				$('html, body').animate({scrollTop: top}, 300, function () {
					$a.trigger('click');
				});
			} else {
				$a.trigger('click');
			}
			return false;
		}
	});

	$('.worker-page-top').removeClass('worker-page-top-prepare');

	var sb = new SocialButtons();
		//sb.bindShares();

	$expandTitle.click(function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$ul.slideUp();
		} else {
			$(this).addClass('active');
			$ul.slideDown();
		}
	});
	$(window).bind('resize.checkWorkerMenu', function () {
		$textContent.removeClass('expand-menu');
		var isHide = !$ul.is(':visible'),
			isExpand = false;
		$ul.show();
		var oldTop = -1;
		$('li', $textContent).each(function (i) {
			var top = $(this).offset().top;
			if (i == 0) {
				oldTop = top;
			} else {
				if (Math.abs(oldTop - top) > 5) {
					$textContent.addClass('expand-menu');
					isExpand = true;
					return false;
				}
			}
		});
		if (isExpand) {
			if (!$expandTitle.hasClass('active')) {
				$ul.hide();
			}
		}
	}).trigger('resize.checkWorkerMenu');
	
	function tagsExpandMenuInit ($container) {
		var $title = $('.tags-expand-title', $container),
			$ul = $('ul', $title.parent());
		$title.click(function () {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$ul.slideUp();
			} else {
				$(this).addClass('active');
				$ul.slideDown();
			}
		});
	}
	var $bl = $('.bl-grid');
	if ($bl.length) {
		tagsExpandMenuInit($bl);
	}

	function setBackstage($container) {
		var old_columns = $container.data('backstage-columns'),
			new_columns = 0,
			old_top,
			$list = $('.item', $container),
			slideTime = 50;

		function nextSlide($item, isDec) {
			var index = $item.data('slide-index') + 1,
				list = $item.data('slides');
			if (isDec) index = index - 2;
			var img = list[index];
			if (img) {
				$item.data('slide-index', index);
				$('img.image', $item).attr('src', $item.data('slide-dir') + img);
				var t = window.setTimeout(function () {
					nextSlide($item, isDec);
				}, slideTime);
				$item.data('tot', t);
			} else {
				if ($item.data('is-hover')) {
					var t = window.setTimeout(function () {
						nextSlide($item, !isDec);
					}, slideTime * 10);
					$item.data('tot', t);
				} else {
					window.clearTimeout($item.data('tot'));
					$item.removeData('tot');
				}
			}
		}

		$list.each(function () {
			if (!$(this).data('mouseenter-init')) {
				$(this).data('mouseenter-init', true);
				if ($(this).data('slides')) {
					$(this).mouseenter(function () {
						var $item = $(this);
						$item.data('is-hover', true);
						if ($item.data('slide-index') === undefined) {
							$item.data('slide-index', 0);
						}
						if ($item.data('tot')) {
							window.clearTimeout($item.data('tot'));
							$item.removeData('tot');
						}
						var t = window.setTimeout(function () {
							nextSlide($item);
						}, slideTime);
						$item.data('tot', t);
					}).mouseleave(function () {
						var $item = $(this);
						$item.data('is-hover', false);
						if ($item.data('tot')) {
							window.clearTimeout($item.data('tot'));
							$item.removeData('tot');
						}
						var t = window.setTimeout(function () {
							nextSlide($item, true);
						}, slideTime);
						$item.data('tot', t);
					});
				}
			}
		});
		$list.css('margin-top', 0).each(function (i) {
			new_columns++;
			var top = $(this).offset().top;
			if (i == 0) {
				old_top = top;
			} else {
				if (Math.abs(top - old_top) > 5) {
					new_columns--;
					return false;
				}
			}
		});
		$(window).off('resize.setBackstage');
		if (new_columns == 1) {
			return false;
		}
		if (new_columns != old_columns) {
			$list.each(function (i) {
				if (i + 1 > new_columns) {
					var $parent = $list.eq(i - new_columns);
					var top = $parent.offset().top + $parent.height() - $(this).offset().top + parseInt($parent.css('margin-bottom') || 0);
					$(this).css('margin-top', top + 'px');
				}
			});
			$('img', $list).off('load').one('load', function () {
				$container.removeData('backstage-columns');
				setBackstage($container);
			});
			$(window).on('resize.setBackstage', function () {
				setBackstage($container);
			});
		}
	}

	var $backstage = $('.backstage-grid');
	if ($backstage.length) {
		setBackstage($backstage);
	}


	var $grid = $('#als-grid-main');
	$grid.alsGrid({
		onGridChange: function ($container, $newContainer) {
			var type = $newContainer.data('type');
			if (type == 'portfolio') {
				//$('.remove-init', $container).removeClass('remove-init');
				//ALSPortfolio.init();
				//$('.remove-init', $newContainer).removeClass('remove-init');
			} else {
				//ALSPortfolio.unbind();
			}
			if (type == 'business-lynch') {
				tagsExpandMenuInit($container);
			}
			if (type == 'backstage') {
				setBackstage($('.backstage-grid', $container));
			} else {
				$(window).off('resize.setBackstage');
			}
			sb.bindShares();

			/*
			var oTop = $('.expand-title-container', $grid).offset().top,
				top = $(document).scrollTop(),
				wHeight = $(window).height();
			if (oTop - top > wHeight / 2) {
				$('body,html').animate({
					scrollTop: oTop
				}, 300);
			}
			*/
		},
		// пауза при смене сетки
		getChangePause: function ($container, $newContainer) {
			/*
			var time = 0,
				type = $newContainer.data('type');
			if ($cover.length) {

				if (!$('li.first-worker-menu').hasClass('active')) {
					// уменьшение обложки
					if (!$cover.hasClass('worker-page-top-with-cover-compact')) {
						var top = $(document).scrollTop();
						if (top > $cover.innerHeight() / 2) {
							var $grid = $('.als-grid-container').first();
							var start_top = $grid.offset().top;
							$cover.addClass('no-transition');
							$cover[0].offsetHeight;
							$cover.addClass('worker-page-top-with-cover-compact');
							var end_top = $grid.offset().top;
							$cover[0].offsetHeight;
							$cover.removeClass('no-transition');
							top = $(document).scrollTop() - (start_top - end_top);
							$(document).scrollTop(top);
							time = 0;
						} else {
							time = 500;
							$cover.addClass('worker-page-top-with-cover-compact');
						}
					}
				} else {
					// увеличение обложки
					if ($cover.hasClass('worker-page-top-with-cover-compact')) {
						var top = $(document).scrollTop();
						if (top > 100){
							var $grid = $('.als-grid-container').first();
							var start_top = $grid.offset().top;
							$cover.addClass('no-transition');
							$cover[0].offsetHeight;
							$cover.removeClass('worker-page-top-with-cover-compact');
							var end_top = $grid.offset().top;
							$cover[0].offsetHeight;
							$cover.removeClass('no-transition');
							top = $(document).scrollTop() + (end_top - start_top);
							$(document).scrollTop(top);
							time = 0;
						} else {
							$cover.removeClass('worker-page-top-with-cover-compact');
							time = 500;
						}
					}
				}
			}
			*/
			return 0;
		},
		onTitleChange: function (callback) {
			var data = callback(),
				$a = data.$a,
				$li = data.$li,
				$ul = $li.closest('ul');
			if (!$textContent.hasClass('expand-menu')) {
				$('li.no-border', $ul).removeClass('no-border');
				$('.animated-line', $ul).remove();
				var left = $li.offset().left - $a.offset().left;
				var $line = $('<div />').addClass('animated-line').width($a.width()).appendTo($a);
				$li.addClass('no-border');
				new AlsEffects([{
					elements: $line,
					onElement: function ($el) {
						$line.css({
							width: $li.width() + 'px',
							left: left + 'px'
						});
					}
				}], {
					callback: function () {
						$('li.no-border', $ul).removeClass('no-border');
						$('.animated-line', $ul).remove();
					}
				});
			}
		}
	});

	$(document).on(':als_grid_items_load', function () {
		sb.bindShares();
	});

	$(document).on('mouseenter', '.append-list-people .worker-container a', function () {
		var $p = $(this).closest('.photo-append'),
			$popup = $(this).closest('.worker-container').find('.worker-popup-menu');
		$popup.removeAttr('style');
		//if ($p.css('position') == 'relative') {
		if (1) {
			var pLeft = $p.offset().left,
				popupLeft = $popup.offset().left,
				left;
			if (popupLeft < pLeft){
				left = parseInt($popup.css('margin-left')) + pLeft - popupLeft + 10;
				$popup.css('margin-left', left + 'px');
			} else {
				var pWidth = $p.width(),
					popupWidth = $popup.width();
				if (popupLeft + popupWidth > pLeft + pWidth) {
					left  = parseInt($popup.css('margin-left')) - ((popupLeft + popupWidth) - (pLeft + pWidth)) - 10;
					$popup.css('margin-left', left + 'px');
				}
			}
		}
	});
});
